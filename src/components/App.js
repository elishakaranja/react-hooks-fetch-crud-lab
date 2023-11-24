import React, { useState, useEffect } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions when the component mounts
    const fetchQuestions = () => {
      fetch("http://localhost:4000/questions")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setQuestions(data);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
        });
    };

    fetchQuestions();
  }, []);

  const handleFormSubmit = (formData) => {
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((newQuestion) => {
        setQuestions([...questions, newQuestion]);
        setPage("List"); // Switch to the list page after adding a question
      })
      .catch((error) => {
        console.error("Error creating question:", error);
      });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setQuestions(questions.filter((question) => question.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const handleDropdownChange = (id, correctIndex) => {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(() => {
        setQuestions((prevQuestions) =>
          prevQuestions.map((question) =>
            question.id === id ? { ...question, correctIndex } : question
          )
        );
      })
      .catch((error) => {
        console.error("Error updating question:", error);
      });
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <QuestionForm onFormSubmit={handleFormSubmit} />
      ) : (
        <QuestionList
          questions={questions}
          onDelete={handleDelete}
          onChange={handleDropdownChange}
        />
      )}
    </main>
  );
}

export default App;
