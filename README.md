# GO Travel 🌍✈️

Crie listas com suas próximas viagens e convide seus amigos para compartilhar esses momentos! 🚀

## Sobre o App

O GO Travel é um aplicativo para aqueles que gostam de conhecer novos lugares e se divertir com seus amigos, facilitando a organização e o planejamento de suas próximas viagens.

### Principais Recursos

- **Crie Listas de Viagens:** Adicione os destinos dos seus sonhos e organize suas próximas viagens de forma simples.
  
- **Adicione Amigos:** Transforme suas viagens em experiências compartilhadas! Adicione amigos à sua lista e planeje juntos os momentos incríveis que estão por vir.

## Variáveis de Ambiente

Antes de seguir para a instalação do aplicativo, é preciso criar um arquivo ***.env*** em cada pasta (mobile e server) e adicionar as seguintes váriaveis de ambiente:

1. **Na pasta 'server'**
- `DATABASE_URL`: URL para conectar o prisma com o db 
- `JWT_SECRET`: Um valor para codificação do JWT

2. **Na pasta 'mobile'**
- `EXPO_PUBLIC_API_URL`: URL onde está a API. Caso estiver rodando localmente, utilizar o IP da máquina ao invés de 'localhost'

## Como Começar

Para começar a testar o GO Travel, é preciso seguir os seguintes passos para a instalação:

1. **Clone o Repositório:**
   ```bash
   git clone https://github.com/leonardo-a/go-travel.git
   cd go-travel
   ```

2. **Crie o banco de dados e inicie o servidor:**
   ```bash
   cd server
   docker-compose up -d 
   ```

3. **Instale as dependências e inicie o Expo:**
   ```bash
   cd .. # voltar para raíz do repósitório
   cd mobile
   npm install
   npm start
   ```

4. **Abra no emulador ou no Expo Go**
   Quando surgir o QR Code no terminal, você pode rodar o aplicativo no emulador do Android ou do iOS ***(apenas para MacOS)***. Além disso, com seu dispositivo fisico com o **Expo GO** instalado, você pode ler o QR Code e executar direto do seu aparelo!