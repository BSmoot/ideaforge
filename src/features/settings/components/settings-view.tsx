import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { AIConfigSection } from './ai-config-section';
import { DataManagementSection } from './data-management-section';

const THEME_OPTIONS = [
  { value: 'dark' as const, label: 'Dark' },
  { value: 'light' as const, label: 'Light' },
  { value: 'system' as const, label: 'System' },
];

export function SettingsView(): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-2xl font-bold text-steel-100">Settings</h1>

      <div className="space-y-10">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-steel-100">Appearance</h2>
          <div className="flex gap-2">
            {THEME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { setTheme(opt.value); }}
                className={cn(
                  'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                  theme === opt.value
                    ? 'border-forge-500 bg-forge-500/10 text-forge-400'
                    : 'border-steel-700 text-steel-400 hover:border-steel-600 hover:text-steel-200'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-steel-800" />

        <AIConfigSection />

        <hr className="border-steel-800" />

        <DataManagementSection />

        <hr className="border-steel-800" />

        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-steel-100">Privacy</h2>
          <div className="rounded-lg border border-steel-800 bg-steel-900 p-4 text-sm text-steel-400 space-y-2">
            <p>Your data is stored locally in your browser. Nothing is sent to any server.</p>
            <p>When you use AI features, your idea content is sent directly to the AI provider (Anthropic or OpenAI) using your own API key.</p>
            <p>Your API key is stored in browser localStorage in plaintext. This is standard for client-side applications.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
