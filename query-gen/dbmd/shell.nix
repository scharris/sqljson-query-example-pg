with (import <nixpkgs> {});

mkShell {
  buildInputs = [
    openjdk11
    maven
  ];
  shellHook = ''
    echo Welcome to the dbmd-fetcher project.
  '';
}
