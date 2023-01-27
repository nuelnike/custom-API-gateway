package security

import "golang.org/x/crypto/bcrypt"

//EncryptPassword func
func EncryptPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(hashed), err
}

//VerifyPassword func
func VerifyPassword(hashed, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashed), []byte(password))
}
