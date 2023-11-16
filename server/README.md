# App

GoTravel API

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [x] Deve ser possível o usuário criar uma nova lista de viagens;
- [x] Deve ser possível obter as listas do usuário logado;
- [x] Deve ser possível o usuário adicionar uma nova viagem em uma de suas listas;
- [x] Deve ser possível o usuário enviar um convite de amizade para outro usuário;
- [x] Deve ser possível o usuário aceitar/recusar um convite de amizade;
- [x] Deve ser possível o usuário adicionar um membro em uma de suas listas;
- [ ] Deve ser possível o usuário concluir uma viagem;
- [x] Deve ser possível o usuário buscar um amigo pelo nome;
- [ ] Deve ser possível o usuário editar seus dados;
- [ ] Deve ser possível o usuário editar suas preferências do app;
- [x] Deve ser possível o usuário ver suas viagens mais próximas;

## RNs (Regras de negócio)

- [x] O usuário que criar uma lista deve estar como membro dela;
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [x] O usuário não pode adicionar um usuário que não é seu amigo em uma lista;
- [ ] O usuário não pode concluir uma viagem antes do dia de inicío;
- [ ] O usuário não pode editar uma lista que não for dele;

## RNFs (Requisitos não-funcionais)

- [x] A senha do usuário precisa estar criptografada;
- [x] Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- [x] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [x] O usuário deve ser identificado por um JWT (JSON Web Token);