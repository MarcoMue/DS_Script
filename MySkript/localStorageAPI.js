// Define your classes
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }
}

// Create instances of your classes
const person1 = new Person("Alice", 30);
const person2 = new Person("Bob", 25);
const car1 = new Car("Toyota", "Corolla");
const car2 = new Car("Honda", "Civic");

// Create an object to hold all instances
const dataToSave = {
  persons: [person1, person2],
  cars: [car1, car2],
};

// Serialize the object to a JSON string
const jsonString = JSON.stringify(dataToSave);

// Save the JSON string to localStorage
localStorage.setItem("myData", jsonString);

// Retrieve the JSON string from localStorage
const retrievedJsonString = localStorage.getItem("myData");

// Deserialize the JSON string back to an object
const retrievedData = JSON.parse(retrievedJsonString);

// Recreate instances of your classes from the retrieved data
const retrievedPersons = retrievedData.persons.map(
  (p) => new Person(p.name, p.age)
);
const retrievedCars = retrievedData.cars.map((c) => new Car(c.make, c.model));

// Log the retrieved instances to verify
console.log(retrievedPersons);
console.log(retrievedCars);

// Define some methods in the library script
window.c_sdk = {
  libraryMethod1: function (data) {
    console.log("Library Method 1 called with data:", data);
  },
  libraryMethod2: function (param) {
    console.log("Library Method 2 called with param:", param);
  },
};
