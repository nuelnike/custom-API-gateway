package security

import (
	mixin "gofiber/src/app/utility/mixins"
	"errors"
	"fmt"
	"strconv"
	"time"

	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gofiber/fiber/v2"
)

//CreateToken func
func CreateToken(userID string) (string, error) {
	claims := jwt.MapClaims{}
	claims["authorized"] = true
	claims["userId"] = userID
	duration, err := strconv.ParseUint(mixin.Config("JWT_EXP"), 10, 32)
	if err != nil {
		return "", err
	}
	claims["exp"] = time.Now().Add(time.Hour * time.Duration(duration)).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(mixin.Config("JWT_KEY")))
}

//TokenValid func
func TokenValid(c *fiber.Ctx) error {
	tokenString := ExtractToken(c)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("UNEXPECTED SIGNING METHOD: %v", token.Header["alg"])
		}
		return []byte(mixin.Config("JWT_KEY")), nil
	})
	if err != nil {
		return err
	}
	if _, ok := token.Claims.(jwt.MapClaims); !ok || !token.Valid {
		return errors.New("INVALID TOKEN")
	}

	return nil
}

//ExtractToken func
func ExtractToken(c *fiber.Ctx) string {
	return c.Get("x-access-token")
}

//ExtractTokenID func
func ExtractTokenID(c *fiber.Ctx) (string, error) {

	tokenString := ExtractToken(c)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("UNEXPECTED SIGNING METHOD: %v", token.Header["alg"])
		}
		return []byte(mixin.Config("JWT_KEY")), nil
	})
	if err != nil {
		return "", err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		userID := fmt.Sprintf("%s", claims["userId"])
		return userID, nil
	}

	return "", errors.New("no user id found")
}
