
## Docker steps

- docker build -t shop-api:latest . --platform=linux/amd64
- docker run --platform linux/amd64 --name shop-api -p 3000:3000 shop-api:latest
- docker tag shop-api:latest rg.fr-par.scw.cloud/namespace-trusting-mclean/shop-api:latest
- docker push rg.fr-par.scw.cloud/namespace-trusting-mclean/shop-api:latest

## Scaleway steps

- scw login
- scw serv
