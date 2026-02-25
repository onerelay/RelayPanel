// src/routes/quest.tsx
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, Copy, Eye, EyeOff } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

export const Route = createFileRoute('/quest')({
  component: QuestPage,
})

function QuestPage() {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  const scriptCode = `delete window.$;
let wp = webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
webpackChunkdiscord_app.pop();

let modules = Object.values(wp.c);
let find = p => modules.find(p)?.exports;
let Q,R,C,D,http;

if (find(x => x?.exports?.Z?.__proto__?.getStreamerActiveStreamMetadata)) {
  Q = find(x => x?.exports?.Z?.__proto__?.getQuest)?.Z;
  R = find(x => x?.exports?.ZP?.getRunningGames)?.ZP;
  C = find(x => x?.exports?.Z?.__proto__?.getAllThreadsForParent)?.Z;
  D = find(x => x?.exports?.Z?.__proto__?.flushWaitQueue)?.Z;
  http = find(x => x?.exports?.tn?.get)?.tn;
} else {
  Q = find(x => x?.exports?.A?.__proto__?.getQuest)?.A;
  R = find(x => x?.exports?.Ay?.getRunningGames)?.Ay;
  C = find(x => x?.exports?.A?.__proto__?.getAllThreadsForParent)?.A;
  D = find(x => x?.exports?.h?.__proto__?.flushWaitQueue)?.h;
  http = find(x => x?.exports?.Bo?.get)?.Bo;
}

(async () => {
  if (window.__questSpoofActive) {
    console.log('Already running');
    return;
  }
  window.__questSpoofActive = true;

  try {
    let quest = [...Q.quests.values()].find(q =>
      q.userStatus?.enrolledAt && !q.userStatus?.completedAt &&
      new Date(q.config.expiresAt) > Date.now() &&
      ['WATCH_VIDEO','PLAY_ON_DESKTOP','STREAM_ON_DESKTOP','PLAY_ACTIVITY','WATCH_VIDEO_ON_MOBILE']
        .some(t => (q.config.taskConfig ?? q.config.taskConfigV2).tasks[t])
    );
    if (!quest) {
      console.log('No active quest');
      window.__questSpoofActive = false;
      return;
    }

    console.log(\`🎯 Quest: \${quest.config.messages.questName}\`);
    let taskCfg = quest.config.taskConfig ?? quest.config.taskConfigV2;
    let task = Object.keys(taskCfg.tasks).find(t => t in taskCfg.tasks);
    let need = taskCfg.tasks[task].target;
    let done = quest.userStatus?.progress?.[task]?.value || 0;
    if (done >= need) {
      console.log('✅ Already completed');
      window.__questSpoofActive = false;
      return;
    }

    const logProgress = (current) => {
      let pct = Math.floor((current / need) * 100);
      console.log(\`Progress: \${current}/\${need} (\${pct}%)\`);
    };

    if (task.includes('VIDEO')) {
      for (let p = done; p < need; p++) {
        await http.post({ url: \`/quests/\${quest.id}/video-progress\`, body: { timestamp: p } });
        if (p % 10 === 0 || p === done) logProgress(p);
        await new Promise(r => setTimeout(r, 1000));
      }
      logProgress(need);
      console.log('✅ Video done');
    } else if (task === 'PLAY_ACTIVITY') {
      let chan = C.getSortedPrivateChannels()[0]?.id || '@me';
      let key = \`call:\${chan}:1\`;
      while (done < need) {
        let res = await http.post({ url: \`/quests/\${quest.id}/heartbeat\`, body: { stream_key: key, terminal: false } });
        done = res?.body?.progress?.PLAY_ACTIVITY?.value ?? done;
        logProgress(done);
        if (done >= need) {
          await http.post({ url: \`/quests/\${quest.id}/heartbeat\`, body: { stream_key: key, terminal: true } });
          break;
        }
        await new Promise(r => setTimeout(r, 20000));
      }
      console.log('✅ Activity done');
    } else {
      try {
        console.log('Fetching application data...');
        let response = await http.get({ url: \`/applications/public?application_ids=\${quest.config.application.id}\` });
        let appList = response.body;
        let app = appList[0];
        if (!app) throw new Error('Application not found');

        let exe = app.executables?.find(x => x.os === 'win32')?.name?.replace('>','') || app.name + '.exe';
        let fake = {
          cmdLine: \`"C:\\\\Program Files\\\\\${app.name}\\\\\${exe}"\`, exeName: exe,
          exePath: \`C:\\\\Program Files\\\\\${app.name}\\\\\${exe}\`, hidden: false,
          isLauncher: false, id: app.id, name: app.name,
          pid: 1000 + Math.floor(Math.random() * 30000), pidPath: [],
          processName: exe.replace('.exe',''), start: Date.now() - 60000,
          focused: true, lastFocused: Date.now(),
          windowHandle: { value: 10000 + Math.floor(Math.random() * 90000) },
          windowTitle: app.name, platform: 'win32', type: 0
        };
        let orig = R.getRunningGames;
        R.getRunningGames = () => [fake];
        R.getCandidateGames = () => [fake];
        R.getGameForPID = pid => fake.pid === pid ? fake : null;
        D.dispatch({ type: 'RUNNING_GAMES_CHANGE', removed: [], added: [fake], games: [fake] });

        let interval = setInterval(() => fake.lastFocused = Date.now(), 1000);
        let listener = e => {
          if (e.questId !== quest.id) return;
          let prog = e.userStatus?.progress?.[task]?.value;
          if (prog !== undefined) {
            logProgress(prog);
            if (prog >= need) {
              clearInterval(interval);
              D.unsubscribe('QUESTS_SEND_HEARTBEAT_SUCCESS', listener);
              R.getRunningGames = orig;
              R.getCandidateGames = orig;
              R.getGameForPID = () => null;
              D.dispatch({ type: 'RUNNING_GAMES_CHANGE', removed: [fake], added: [], games: [] });
              console.log('✅ Quest completed');
              window.__questSpoofActive = false;
            }
          }
        };
        D.subscribe('QUESTS_SEND_HEARTBEAT_SUCCESS', listener);
      } catch (err) {
        console.log('❌ Spoof error:', err.message);
        window.__questSpoofActive = false;
      }
    }
  } catch (err) {
    console.error(err);
    window.__questSpoofActive = false;
  }
})();`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Warning Banner */}
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4 mb-8 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-500 text-sm">
          ⚠️ Use at your own risk. This script modifies Discord's internal state and may violate Discord's Terms of Service.
        </p>
      </div>

      <h1 className="text-3xl font-bold text-white mb-6">Quest Spoofer</h1>

      {/* Instructions */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">How to Use</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Open Discord.</li>
          <li>Open Settings &gt; Advanced &gt; <span className="font-mono text-cyan-400">Developer Mode</span> ON.</li>
          <li>Make sure you have <span className="font-mono text-cyan-400">Quest</span> active.</li>
          <li>Press <kbd className="px-2 py-1 bg-slate-700 rounded text-sm">CTRL + SHIFT + I</kbd> to open Developer Tools.</li>
          <li>Go to the <span className="font-mono text-cyan-400">Console</span> tab.</li>
          <li>Click <strong>"Copy"</strong> below and paste it into the console.</li>
          <li>Press <kbd className="px-2 py-1 bg-slate-700 rounded text-sm">Enter</kbd> to run.</li>
        </ol>
        <p className="text-gray-400 text-sm mt-4">
          Note: The script automatically finds active quests and attempts to complete them.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={copyToClipboard}
          className="inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
        >
          <Copy className="w-5 h-5" />
          {copied ? 'Copied!' : 'Copy'}
        </button>
        <button
          onClick={() => setShowCode(!showCode)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
        >
          {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          {showCode ? 'Hide' : 'Look'}
        </button>
      </div>

      {/* Code Block with syntax highlighting and line numbers */}
      {showCode && (
        <div className="rounded-lg overflow-hidden border border-slate-700">
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            showLineNumbers={true}
            lineNumberStyle={{ color: '#6b7280', fontSize: '0.875rem' }}
            customStyle={{
              margin: 0,
              padding: '1.5rem',
              backgroundColor: '#0f172a', // slate-900
              fontSize: '0.875rem',
              lineHeight: 1.5,
            }}
            wrapLines={true}
          >
            {scriptCode}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  )
}