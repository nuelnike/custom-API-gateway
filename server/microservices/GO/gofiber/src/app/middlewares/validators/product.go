package validator

import (
	"html"
	"strings"

	model "gofiber/src/app/database/models"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func ValidateCreateProduct(c *fiber.Ctx) error {
	return validateProduct(c)
}

func ValidateUpdateProduct(c *fiber.Ctx) error {

	productID := html.EscapeString(strings.TrimSpace(c.Params("productId")))

	_, err := uuid.Parse(productID)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "message": "Invalid product id supplied", "data": nil})
	}

	return validateProduct(c)
}

func ValidateDeleteProduct(c *fiber.Ctx) error {
	return validateProductID(c, "productId")
}

func validateProduct(c *fiber.Ctx) error {
	product := new(model.Product)

	err := c.BodyParser(product)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"success": false, "message": "Invalid input supplied! Please review your input", "data": nil})
	}

	// authorID := html.EscapeString(strings.TrimSpace(product.AuthorID))
	// _, err = uuid.Parse(authorID)

	// if err != nil {
	// 	return c.Status(404).JSON(fiber.Map{"success": false, "message": "Author is required", "data": nil})
	// }

	if product.Name == "" {
		return c.Status(404).JSON(fiber.Map{"success": false, "message": "Name is required", "data": nil})
	}

	if product.Description == "" {
		return c.Status(404).JSON(fiber.Map{"success": false, "message": "Description is required", "data": nil})
	}

	categoryID := html.EscapeString(strings.TrimSpace(product.CategoryID))
	_, err = uuid.Parse(categoryID)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "message": "Category is required", "data": nil})
	}

	if len(product.Tags) > 0 {
		for _, v := range product.Tags {
			if v == "" {
				return c.Status(404).JSON(fiber.Map{"success": false, "message": "Tag value(s) is required", "data": nil})
			}
		}
	}

	return c.Next()
}

func validateProductID(c *fiber.Ctx, key string) error {
	keyID := html.EscapeString(strings.TrimSpace(c.Params(key)))

	if keyID == "" || keyID == "undefined" {
		return c.Status(404).JSON(fiber.Map{"success": false, "message": "Invalid " + key + " supplied", "data": nil})
	}

	_, err := uuid.Parse(keyID)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"success": false, "message": "Invalid " + key + " supplied", "data": nil})
	}

	return c.Next()
}
