package TRC

import (
	"fmt"
	"net/http"
	"text/template"
)

type Error struct {
	Err       string
	ErrNumber string
}

func Atoi(num string) int {
	if num[len(num)-1] == '/' {
		num = num[:len(num)-1]
	}
	digit := 0
	for _, d := range num {
		if d >= '0' && d <= '9' {
			digit = digit*10 + (int(d) - 48)
		} else {
			return -1
		}
	}
	return digit
}

func renderErrorPage(w http.ResponseWriter, errMsg string, errCode int) {
	var Err Error

	tmpl, tempErr := template.ParseFiles("templates/error.html")
	if tempErr != nil {
		http.Error(w, tempErr.Error(), http.StatusNotFound)
		return
	}
	Err = Error{Err: errMsg, ErrNumber: fmt.Sprintf("%d", errCode)}
	w.WriteHeader(errCode)
	tmpl.Execute(w, Err)
}
