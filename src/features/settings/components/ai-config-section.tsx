import { useState, useEffect } from 'react';
import { Button, Input } from '@/components/ui';
import { SettingsRepository } from '@/database/repositories/settings-repository';
import { useDatabase } from '@/database/database-context';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

export function AIConfigSection(): React.ReactElement {
  const { db, manager } = useDatabase();
  const { addToast } = useToast();
  const [provider, setProvider] = useState('anthropic');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('claude-sonnet-4-5-20250929');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const repo = new SettingsRepository(db);
    const savedProvider = repo.get('ai_provider');
    const savedKey = repo.get('ai_api_key');
    const savedModel = repo.get('ai_model');
    if (savedProvider) setProvider(savedProvider);
    if (savedKey) setApiKey(savedKey);
    if (savedModel) setModel(savedModel);
  }, [db]);

  const handleSave = (): void => {
    const repo = new SettingsRepository(db);
    repo.set('ai_provider', provider);
    repo.set('ai_api_key', apiKey);
    repo.set('ai_model', model);
    void manager.persist();
    addToast('AI settings saved', 'success');
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-steel-100">AI Configuration</h2>

      <div>
        <label className="mb-1 block text-sm text-steel-300">Provider</label>
        <select
          value={provider}
          onChange={(e) => { setProvider(e.target.value); }}
          className="w-full rounded-md border border-steel-700 bg-steel-800 px-3 py-2 text-sm text-steel-200 focus:outline-none focus:ring-2 focus:ring-forge-500"
        >
          <option value="anthropic">Anthropic (Claude)</option>
          <option value="openai">OpenAI</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm text-steel-300">API Key</label>
        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => { setApiKey(e.target.value); }}
            placeholder="Enter your API key"
          />
          <button
            type="button"
            onClick={() => { setShowKey(!showKey); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-steel-400 hover:text-steel-200"
          >
            {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-steel-500">
          Stored in browser localStorage in plaintext. Your key never leaves your browser except to call the AI provider API directly.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm text-steel-300">Model</label>
        <Input
          value={model}
          onChange={(e) => { setModel(e.target.value); }}
          placeholder="e.g., claude-sonnet-4-5-20250929"
        />
      </div>

      <Button variant="primary" onClick={handleSave}>
        Save AI Settings
      </Button>
    </section>
  );
}
