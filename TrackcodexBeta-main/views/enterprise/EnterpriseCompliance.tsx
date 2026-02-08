import React from 'react';

const ComplianceReport = ({ title, date, downloadLink }: { title: string, date: string, downloadLink: string }) => (
    <div className="flex justify-between items-center py-3 border-b border-gh-border last:border-0 hover:bg-gh-bg-tertiary px-4 transition-colors">
        <div>
            <h4 className="text-sm font-medium text-gh-text">{title}</h4>
            <p className="text-xs text-gh-text-secondary mt-0.5">
                {date ? `Published on ${date}` : 'Date not available'}
            </p>
        </div>
        <a href={downloadLink} className="flex items-center gap-1.5 px-3 py-1.5 bg-gh-bg-secondary hover:bg-gh-bg-tertiary border border-gh-border rounded-md text-xs font-semibold text-gh-text transition-colors no-underline">
            <span className="material-symbols-outlined text-[16px]">download</span>
            Download
        </a>
    </div>
);

export default function EnterpriseCompliance() {
    return (
        <div className="flex h-full min-h-screen bg-gh-bg text-gh-text">
            {/* Main Content */}
            <div className="flex-1 max-w-5xl mx-auto px-4 py-6">
                <h2 className="text-xl font-semibold text-gh-text mb-6 pb-2 border-b border-gh-border">Compliance</h2>

                <div className="mb-8">
                    <h3 className="text-base font-semibold text-gh-text mb-4">Resources</h3>

                    <div className="border border-gh-border rounded-md overflow-hidden bg-gh-bg">
                        <div className="bg-gh-bg-secondary px-4 py-2 border-b border-gh-border flex justify-between">
                            <span className="text-xs font-semibold text-gh-text">Report</span>
                            <span className="text-xs font-semibold text-gh-text">Coverage period</span>
                        </div>

                        {/* Reports List */}
                        <div className="divide-y divide-gh-border">
                            <ComplianceReport
                                title="SOC 1 Type 1 Report"
                                date="2024-05-31"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="SOC 1 Type 2 Report"
                                date="2023-10-01 to 2024-09-30"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="SOC 2 Type 1 Report"
                                date="2024-05-31"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="SOC 2 Type 2 Report"
                                date="2023-10-01 to 2024-09-30"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="SOC 1 Type 1 Bridge Letter"
                                date="2023-10-01 to 2023-12-31"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="SOC 2 Type 1 Bridge Letter"
                                date="2023-10-01 to 2023-12-31"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="ISO/IEC 27001:2013 Certificate"
                                date="Valid until 2025-10-31"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="CPM CMS"
                                date="Last updated 2021-12-02"
                                downloadLink="#"
                            />
                            <ComplianceReport
                                title="Bug Bounty"
                                date="Report for January - March, 2024"
                                downloadLink="#"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
