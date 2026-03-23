FROM nixos/nix:2.34.1

# So we can work with flake.nix
ENV NIX_CONFIG="experimental-features = nix-command flakes"

WORKDIR /app

COPY flake.* .
RUN nix develop -c echo Successfully downloaded nix resources

COPY package.json .
COPY package-lock.json .
RUN nix develop -c npm ci --omit dev && echo "Installed prod npm packages"

COPY . .
ENTRYPOINT [ "nix", "develop", "-c", "npm", "run", "start" ]

