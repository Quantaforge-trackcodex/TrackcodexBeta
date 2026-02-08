
import axios from 'axios';

// Since we can't easily install tough-cookie/axios-cookiejar-support in the environment right now if not present,
// I'll stick to manual header management for maximum compatibility with the current `node_modules`.
// Actually, I can use a simple class to manage cookies.

class TestClient {
    private cookie: string[] = [];
    private csrfToken: string | null = null;
    private baseURL = 'http://localhost:4000/api/v1';

    constructor(public name: string) { }

    async post(url: string, data: any) {
        try {
            const headers: any = { 'Content-Type': 'application/json' };
            if (this.cookie.length > 0) headers['Cookie'] = this.cookie;
            if (this.csrfToken) headers['x-csrf-token'] = this.csrfToken;

            const res = await axios.post(`${this.baseURL}${url}`, data, { headers });
            this.updateCookies(res.headers);
            if (res.data.csrfToken) this.csrfToken = res.data.csrfToken;
            return res;
        } catch (error: any) {
            return error.response;
        }
    }

    async get(url: string) {
        try {
            const headers: any = {};
            if (this.cookie.length > 0) headers['Cookie'] = this.cookie;

            const res = await axios.get(`${this.baseURL}${url}`, { headers });
            this.updateCookies(res.headers);
            return res;
        } catch (error: any) {
            return error.response;
        }
    }

    async delete(url: string, data?: any) {
        try {
            const headers: any = {};
            if (this.cookie.length > 0) headers['Cookie'] = this.cookie;
            if (this.csrfToken) headers['x-csrf-token'] = this.csrfToken;

            const config: any = { headers };
            if (data) config.data = data;

            const res = await axios.delete(`${this.baseURL}${url}`, config);
            this.updateCookies(res.headers);
            return res;
        } catch (error: any) {
            return error.response;
        }
    }

    private updateCookies(headers: any) {
        const setCookie = headers['set-cookie'];
        if (setCookie) {
            // Simple replacement for test purposes - effectively "browser updates cookies"
            // For array of cookies, we might need merging, but usually we just get session_id
            this.cookie = setCookie;
        }
    }

    getCookie() { return this.cookie; }
}

async function runTests() {
    console.log('🚀 Starting Security Verification Tests...\n');

    const email = `test.security.${Date.now()}@example.com`;
    const password = 'Password123!';
    const username = `security_test_${Date.now()}`;

    // 1. Registration
    console.log(`[1] Registering User A (${email})...`);
    const clientA1 = new TestClient('Session 1');
    const regRes = await clientA1.post('/auth/register', {
        email, password, username, name: 'Security Tester'
    });

    if (regRes.status !== 200) {
        console.error('❌ Registration Failed:', regRes.data);
        process.exit(1);
    }
    console.log('✅ Registration Successful. Got Secure Session + CSRF Token.');

    // 2. Profile Completion Limit Check (Optional, but let's check basic auth access)
    console.log(`[2] Checking Access to /auth/me...`);
    const meRes = await clientA1.get('/auth/me');
    if (meRes.status === 200 && meRes.data.email === email) {
        console.log('✅ Auth Verification Successful.');
    } else {
        console.error('❌ Auth Verification Failed:', meRes.status);
    }

    // 3. Concurrent Session
    console.log(`[3] Logging in User A on Second Device (Session 2)...`);
    const clientA2 = new TestClient('Session 2');
    const loginRes = await clientA2.post('/auth/login', { email, password });

    if (loginRes.status === 200) {
        console.log('✅ Session 2 Login Successful.');
    } else {
        console.error('❌ Session 2 Login Failed:', loginRes.data);
    }

    // 4. List Sessions
    console.log(`[4] Listing Sessions via Session 1...`);
    const sessRes = await clientA1.get('/auth/sessions');
    if (sessRes.status === 200 && sessRes.data.length >= 2) {
        console.log(`✅ Session List Retrieved. Count: ${sessRes.data.length}`);
    } else {
        console.error('❌ Failed to list sessions:', sessRes.data);
    }

    // 5. Revoke Session 2 FROM Session 1
    // We need the ID of session 2.
    // The endpoint returns `isCurrent` flag.
    const sessions = sessRes.data;
    const remoteSession = sessions.find((s: any) => !s.isCurrent);

    if (remoteSession) {
        console.log(`[5] Revoking Remote Session (${remoteSession.id}) from Session 1...`);
        const revokeRes = await clientA1.delete(`/auth/sessions/${remoteSession.id}`);
        if (revokeRes.status === 200) {
            console.log('✅ Revocation Successful.');
        } else {
            console.error('❌ Revocation Failed:', revokeRes.data);
        }

        // Verify Session 2 is dead
        console.log(`[6] Verifying Session 2 is Dead...`);
        const deadRes = await clientA2.get('/auth/me');
        if (deadRes.status === 401) {
            console.log('✅ Session 2 correctly rejected (401).');
        } else {
            console.error('❌ Session 2 still alive! Status:', deadRes.status);
        }
    } else {
        console.warn('⚠️ Could not find remote session to revoke.');
    }

    // 6. Security Log Check
    console.log(`[7] Checking Audit Logs...`);
    const logRes = await clientA1.get('/auth/audit-logs');
    if (logRes.status === 200 && logRes.data.length > 0) {
        console.log(`✅ Audit Logs Retrieved. Count: ${logRes.data.length}`);
        console.log('   Latest Event:', logRes.data[0].action);
    } else {
        console.error('❌ Audit Logs Empty or Failed.');
    }

    // 7. Sudo Mode Deletion
    console.log(`[8] Attempting Account Deletion (Invalid Password)...`);
    const failDelRes = await clientA1.delete('/auth/account', {
        password: 'WrongPassword',
        confirmation: 'DELETE'
    });
    if (failDelRes.status === 401) {
        console.log('✅ Correctly rejected invalid password.');
    } else {
        console.error('❌ Should have rejected! Status:', failDelRes.status);
    }

    console.log(`[9] Attempting Account Deletion (Without Confirmation)...`);
    const noConfRes = await clientA1.delete('/auth/account', {
        password: password,
        confirmation: 'WRONG'
    });
    if (noConfRes.status === 400) {
        console.log('✅ Correctly rejected invalid confirmation.');
    } else {
        console.error('❌ Should have rejected! Status:', noConfRes.status);
    }

    console.log(`[10] Deleting Account (Success Case)...`);
    const delRes = await clientA1.delete('/auth/account', {
        password: password,
        confirmation: 'DELETE'
    });

    if (delRes.status === 200) {
        console.log('✅ Account Deleted Successfully.');
    } else {
        console.error('❌ Account Deletion Failed:', delRes.data);
    }

    // 8. Verify Account Gone
    console.log(`[11] Verifying Account Access is Gone...`);
    const goneRes = await clientA1.get('/auth/me');
    if (goneRes.status === 401) {
        console.log('✅ Session invalidated immediately.');
    } else {
        console.error('❌ Session still active! Status:', goneRes.status);
    }

    console.log('\n✨ Security Verification Complete.');
}

runTests().catch(err => console.error(err));
