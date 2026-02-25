{pkgs}: {
  channel = "unstable";

  packages = [
    pkgs.nodejs_22   # ubah dari nodejs_21
  ];

  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
    "firebase.firebase-explorer"
  ];

  idx.previews = {
    previews = {
      web = {
        command = [
          "npm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}