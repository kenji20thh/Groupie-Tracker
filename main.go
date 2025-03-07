package main

import (
	"fmt"

	TRC "TRC/lib"
)

func main() {
	fmt.Println("http://localhost:8082/")
	var Server TRC.Server
	Server.Run()
}
