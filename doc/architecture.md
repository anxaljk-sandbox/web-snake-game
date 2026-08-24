# Web Snake Game — Architecture

This project's architecture is MVC based.

## What is MVC?

MVC stands for:

* [Model](../src/model)
* [View](../src/view)
* [Controller](../src/controller)

Each part of MVC has its own responsibility:

* The model is the domain: data and business logic.
* The controller's job is narrow: handle input, mediate between model and view. 
* The view presents.

> My source and additional information can be found here: https://developer.mozilla.org/en-US/docs/Glossary/MVC

### How the layers talk in this game

[`main.ts`](../src/main.ts) creates the view and the controller once and wires them together.

From there a round trip looks like this:

1. A key press goes to the [controller](../src/controller/SnakeGameController.ts).
2. The controller tells the [`Snake`](../src/model/Snake.ts) which way to turn, and the snake moves its own tiles.
3. The controller hands those tiles to the [`CanvasView`](../src/view/CanvasView.ts), which draws them.

### Advantages

* This architecture style is clean and allows some flexibility
* It is very scalable; things can easily be added or removed, no matter the scale of the project. 
* MVC keeps the planning and maintenance easy.
* It also very suitable for test-driven development.
* Multiple views can be implemented very easily.

### Disadvantages

* MVC only names three roles. It doesn't say where everything else belongs, so for helpers and shared types you have to invent your own convention (see my [assessment](#personal-assessment) below).
* Big projects should organise the three layers using subfolders or the huge amount of files might make it very chaotic.

## Personal Assessment

I chose it mainly because I know the architecture style well and because it's rather simple.
I thought it would fit this rather simple project.

I don't think it's a bad pick. I really like how my view is managed, for example. 

But I also had to figure that there was no good place for my helpers like [`collision.ts`](../src/model/support/collision.ts), since it wasn't really part of the controller, but it wasn't a model in the classical sense (like the [`Snake`](../src/model/Snake.ts) would be), either.
That's why I added the `support` folder inside my `model` folder. 

It's not textbook MVC anymore, but I think it's the honest solution: those helpers have to live somewhere. 
I put them under `model` and not under `controller` because they answer questions about the game world itself, like: "do these two tiles overlap?", "is this coordinate still on the field?", "where can a new food tile go?". 
That's domain logic, not input handling, so the model was the closer neighbour.

## Project structure

```
web-snake-game/
├── index.html                          # the page itself, holds the canvas element
└── src/
    ├── main.ts                         # entry point: creates view + controller, listens for resize and key presses
    ├── style.css                       # page and canvas styling
    ├── controller/
    │   └── SnakeGameController.ts      # game loop
    ├── model/                          # models that store the state
    │   ├── ...
    │   └── support/                    # helpers and shared types
    │       ├── ...
    └── view/
        └── CanvasView.ts               # all the drawing; tiles, lines, resizing the canvas, etc
```
