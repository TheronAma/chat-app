# Chatting App

Current work in progress chatting Webapp built using NextJS, React, TailwindCSS, Socket.io, Prisma, with a SQL database. Currently, we've implemented basic chatting functionality and choosing/swapping between different chat "channels."

## General Design

The app is designed around a relatively simple backend API, supporting CRUD operations on channels and messages, and depends on NextAuth and OAuth for data users. In addition, before being written to the database, we send messages to Socket.io to be sent out to other users connected to the same channel in real time.