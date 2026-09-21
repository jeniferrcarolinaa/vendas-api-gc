##definindo a imagem do node
FROM node:18-alone
#diret do trab dentro do container
WORKDIR /app
#copiando as depend.
COPY app/package.json ./
#instalando as depend.
RUN npm install
#copiar código da API para o container
COPY app/ ./
#expondo a 3000
EXPOSE 3000
#iniciando a aplic.
CMD ["npm", "start"]