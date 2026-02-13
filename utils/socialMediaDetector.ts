// Social Media Platform Detection Utility

export interface SocialPlatform {
    name: string;
    icon: string; // Material Symbols icon name
    color: string; // Tailwind color class
    pattern: RegExp;
}

export const socialPlatforms: SocialPlatform[] = [
    {
        name: "LinkedIn",
        icon: "work",
        color: "text-[#0A66C2]",
        pattern: /linkedin\.com/i,
    },
    {
        name: "Twitter/X",
        icon: "close",
        color: "text-white",
        pattern: /(twitter\.com|x\.com)/i,
    },
    {
        name: "Instagram",
        icon: "photo_camera",
        color: "text-[#E4405F]",
        pattern: /instagram\.com/i,
    },
    {
        name: "Facebook",
        icon: "thumb_up",
        color: "text-[#1877F2]",
        pattern: /facebook\.com/i,
    },
    {
        name: "GitHub",
        icon: "code",
        color: "text-white",
        pattern: /github\.com/i,
    },
    {
        name: "Reddit",
        icon: "forum",
        color: "text-[#FF4500]",
        pattern: /reddit\.com/i,
    },
    {
        name: "YouTube",
        icon: "play_circle",
        color: "text-[#FF0000]",
        pattern: /youtube\.com/i,
    },
    {
        name: "TikTok",
        icon: "music_note",
        color: "text-white",
        pattern: /tiktok\.com/i,
    },
    {
        name: "Discord",
        icon: "chat",
        color: "text-[#5865F2]",
        pattern: /discord\.(gg|com)/i,
    },
    {
        name: "Twitch",
        icon: "videocam",
        color: "text-[#9146FF]",
        pattern: /twitch\.tv/i,
    },
    {
        name: "Medium",
        icon: "article",
        color: "text-white",
        pattern: /medium\.com/i,
    },
    {
        name: "Dribbble",
        icon: "palette",
        color: "text-[#EA4C89]",
        pattern: /dribbble\.com/i,
    },
    {
        name: "Behance",
        icon: "design_services",
        color: "text-[#1769FF]",
        pattern: /behance\.net/i,
    },
    {
        name: "Stack Overflow",
        icon: "help",
        color: "text-[#F48024]",
        pattern: /stackoverflow\.com/i,
    },
    {
        name: "Dev.to",
        icon: "terminal",
        color: "text-white",
        pattern: /dev\.to/i,
    },
    {
        name: "Mastodon",
        icon: "public",
        color: "text-[#6364FF]",
        pattern: /mastodon\.(social|online|world)/i,
    },
    {
        name: "Telegram",
        icon: "send",
        color: "text-[#26A5E4]",
        pattern: /t\.me/i,
    },
    {
        name: "WhatsApp",
        icon: "phone",
        color: "text-[#25D366]",
        pattern: /wa\.me/i,
    },
    {
        name: "Spotify",
        icon: "library_music",
        color: "text-[#1DB954]",
        pattern: /spotify\.com/i,
    },
    {
        name: "Pinterest",
        icon: "push_pin",
        color: "text-[#E60023]",
        pattern: /pinterest\.com/i,
    },
];

/**
 * Detects the social media platform from a URL
 * @param url - The URL to analyze
 * @returns The detected platform or null if no match
 */
export function detectSocialPlatform(url: string): SocialPlatform | null {
    if (!url || url.trim() === "") return null;

    for (const platform of socialPlatforms) {
        if (platform.pattern.test(url)) {
            return platform;
        }
    }

    return null;
}

/**
 * Gets a display-friendly version of the URL (username or handle)
 * @param url - The full URL
 * @returns Extracted username or the full URL
 */
export function extractUsername(url: string): string {
    if (!url) return "";

    try {
        const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
        const pathname = urlObj.pathname;

        // Remove leading and trailing slashes
        const cleaned = pathname.replace(/^\/|\/$/g, "");

        // Get the first segment (usually the username)
        const segments = cleaned.split("/");
        return segments[0] || url;
    } catch {
        // If URL parsing fails, try to extract from string
        const match = url.match(/(?:@)?([a-zA-Z0-9_.-]+)/);
        return match ? match[1] : url;
    }
}
