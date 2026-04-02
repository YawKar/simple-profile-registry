FROM nixos/nix:2.34.1 AS base

# So we can work with flake.nix
ENV NIX_CONFIG="experimental-features = nix-command flakes"

WORKDIR /app

COPY flake.* .
RUN nix develop -c echo "Successfully downloaded nix resources"

COPY package*.json .
RUN nix develop -c npm ci && echo "Installed npm packages (dev included)"

COPY . .
RUN nix develop -c npm run build

# Take a lighter image and copy the built only
FROM node:25-alpine AS production
WORKDIR /app

COPY package*.json .
RUN npm ci --omit=dev

COPY --from=base /app/dist dist
ENTRYPOINT [ "npm", "run", "start:prod" ]

