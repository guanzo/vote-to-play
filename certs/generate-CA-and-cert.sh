# Generate private key
openssl genrsa -des3 -out myCA.key 2048
# Generate root certificate
openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem

######################
# Create CA-signed certs
######################

NAME=localhost
# Generate private key
[[ -e $NAME.key ]] || openssl genrsa -out private.key 2048
# Create certificate-signing request
[[ -e $NAME.csr ]] || openssl req -new -key private.key -out $NAME.csr
# Create a config file for the extensions
>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = *.$NAME
DNS.2 = $NAME
EOF
# Create the signed certificate
openssl x509 -req -in $NAME.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out public.crt -days 1825 -sha256 -extfile $NAME.ext

# EVERY PASSWORD IS SET TO: "pass"
