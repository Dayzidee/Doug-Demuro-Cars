import React from 'react';

const SettingsSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-glass/50 border border-glass rounded-xl p-lg">
    <h2 className="text-h3 font-heading mb-md border-b border-glass pb-sm">{title}</h2>
    <div className="space-y-md">{children}</div>
  </div>
);

const formLabelStyles = "block text-sm font-medium text-neutral-metallic-silver/80";
const formInputStyles = "w-full bg-glass border-b-2 border-glass p-sm text-white placeholder-neutral-metallic-silver/50 focus:outline-none focus:border-secondary-golden-yellow transition-colors rounded-t-md";

const DashboardSettings = () => {
  return (
    <div>
      <h1 className="text-h2 font-heading mb-lg">Profile & Settings</h1>
      <div className="space-y-lg">
        <SettingsSection title="Account Management">
          <div>
            <label htmlFor="email" className={formLabelStyles}>Email Address</label>
            <input type="email" id="email" className={formInputStyles} defaultValue="user@example.com" />
          </div>
          <div>
            <label htmlFor="password" className={formLabelStyles}>New Password</label>
            <input type="password" id="password" className={formInputStyles} placeholder="********" />
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance">
          <div>
            <label htmlFor="theme" className={formLabelStyles}>Theme</label>
            <select id="theme" className={`${formInputStyles} appearance-none`}>
              <option className="bg-primary-deep-blue">Auto</option>
              <option className="bg-primary-deep-blue">Dark</option>
              <option className="bg-primary-deep-blue">Light</option>
            </select>
          </div>
        </SettingsSection>

        <SettingsSection title="Notifications">
          <div className="flex items-center justify-between">
            <span className={formLabelStyles}>Email Notifications</span>
            <button className="px-sm py-xs bg-primary-gradient text-white font-bold rounded-md text-sm">Toggle</button>
          </div>
          <div className="flex items-center justify-between">
            <span className={formLabelStyles}>SMS Alerts</span>
            <button className="px-sm py-xs bg-neutral-metallic-silver/20 text-white font-bold rounded-md text-sm">Toggle</button>
          </div>
        </SettingsSection>

        <div className="flex justify-end">
            <button className="bg-primary-gradient text-white font-bold py-sm px-lg rounded-lg hover:opacity-90 transition-opacity">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
