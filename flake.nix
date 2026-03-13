{
  description = "simple-profile-registry";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-linux"
      ];

      perSystem =
        { pkgs, ... }:
        {
          devShells.default = pkgs.mkShell {
            nativeBuildInputs = with pkgs; [
              # Toolchain
              typescript
              nodejs_25

              # Automation
              go-task
              pre-commit

              # Formatters & Linters
              yamlfmt
              nixfmt
            ];

            shellHook = ''
              pre-commit uninstall && pre-commit install
              echo "🚀 Modern TypeScript environment"
              task
            '';
          };
        };
    };
}
