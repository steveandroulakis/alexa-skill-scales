// https://medium.com/@equisept/simplest-typescript-with-visual-studio-code-e42843fe437

interface Person {
  age: number;
  name: string;
  say(): string;
}

let mike = {
  age: 25,
  name: "Mike",
  say: function() {
    return (
      "My name issssss " + this.name + " and I'm " + this.age + " years old!"
    );
  }
};

function sayIt(person: Person) {
  return person.say();
}

console.log(sayIt(mike));
