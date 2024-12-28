
## Docker steps

- docker login rg.fr-par.scw.cloud/namespace-trusting-mclean -u nologin --password-stdin <<< "API_KEY"
- docker build -t shop-app:latest . --platform=linux/amd64 --build-arg VITE_API_URL=http://test
- docker run -p 80:80 shop-app:latest
- docker tag shop-app:latest rg.fr-par.scw.cloud/namespace-trusting-mclean/shop-app:latest 
- docker push rg.fr-par.scw.cloud/namespace-trusting-mclean/shop-app:latest

## Github steps
- Build the backend image
- Deploy the backend through scw and get the url
- Build the frontend image and replace the VITE_API_URL with the backend url
- Deploy the frontend through scw and voila
