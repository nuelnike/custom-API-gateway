FROM golang:alpine AS builder

# Add source code
ADD ./ /go/src/order_management/

RUN cd /go/src/order_management && \       
    go build && \
    mv ./order_management /usr/bin/order_management

# Multi-Stage production build
FROM alpine

RUN apk add --update ca-certificates

# Retrieve the binary from the previous stage
COPY --from=builder /usr/bin/order_management /usr/local/bin/order_management

# Set the binary as the entrypoint of the container
CMD ["order_management", "serve"]