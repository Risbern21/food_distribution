FROM golang:1.25-alpine AS build

WORKDIR /app

COPY go.mod ./ 

RUN go mod tidy

COPY . .

RUN GOOS=linux GOARCH=amd64 go build -o backend cmd/main.go

##prod
FROM alpine
WORKDIR /app
COPY --from=build /app/backend .
EXPOSE 42069
CMD ["./backend"]
