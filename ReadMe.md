
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:opsz@9..40&display=swap");

body {
  background: #fff8ed;
  font-family: "DM Sans", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100vw;
}

h1 {
  color: #769642;
  font-size: 3.6em;
}

.animal-pic1 {
  height: 30%;
}

.link {
  text-decoration: none;
  background-color: #f47b5b;
  color: white;
  font-size: 1.4em;
  width: 10em;
  padding: 5px 15px;
  margin: 15px;
  border-radius: 25px;
  text-align: center;
  box-shadow: 0 5px #ffbd59;
}

form {
  font-family: "DM Sans", sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  background-color: #ffbd59;
  padding: 20px 30px;
  border-radius: 20px;
  box-shadow: 5px 6px #f47b5b;
  margin: 20px 10px;
}

label,
input {
  margin: 10px 2px 0 2px;
}

button {
  align-self: center;
  margin: 10px 4px 4px 4px;
  background-color: #3f6a51;
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  border: none;
  width: 15em;
}

button:hover {
  background-color: #769642;
}

button:active {
  background-color: #2d4d3a;
}

.animal-actions {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 130px;
  padding: 20px 0;
}

.delete-form {
  padding: 0;
  box-shadow: 0 0;
  background-color: transparent;
  height: 50px;
  margin: 0 20px 0 0;
  min-height: 100%;
}
.delete-button {
  background-color: #f47b5b;
  text-transform: uppercase;
  padding: 40px 15px;
  width: 70%;
  /* height: 100%; */
  font-size: 1.3em;
  margin: 0;
  min-height: 100%;
}

.edit-link {
  text-decoration: none;
}

.edit-text {
  background-color: #3f6a51;
  text-transform: uppercase;
  padding: 40px 15px;
  font-size: 1.3em;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  text-align: center;
  width: 70%;
  height: 50px;
}

.delete-button:hover {
  background-color: #ffbd59;
}

.delete-button:active {
  background-color: rgb(217, 108, 78);
}

.edit-text:hover {
  background-color: #769642;
}

.edit-text:active {
  background-color: #2d4d3a;
  background-color: rgb(217, 108, 78);
}

ul {
  display: flex;
  flex-wrap: wrap;
}

li {
  list-style: none;
}

.animal-cards {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: black;
  width: 40px;
  height: 70px;
  background-color: white;
  margin: 10px 15px;
  padding: 30px 50px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  border: 2.5px solid #ffbd59;
}

.animal-cards:hover {
  border: 4px solid #f47b5b;
}

.animal-cards:active {
  background-color: #a4cf5f67;
  border: 2.5px solid #ffbd59;
  color: gray;
}
