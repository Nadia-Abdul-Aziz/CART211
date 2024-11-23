# Starting points

IDEAL IDEA FOR FROG GAME

Goal of the game: Steal resources to eventually eat your opponent 

Method to win: Grow to triple the size of opponent (Eating flies) & be able to reach opponent with tongue (Power token collection)

Players: 2 player (multiplayer)

Aesthetic: Spiders and bugs

Mechanics:

- frog rotation & position (DONE)
    - two frogs on opposite sides (player 1 & player 2)
    - Meant to fight over power tokens & flies in the common pool
    - 180 degree rotation of the frog
    - Frog cannot move on y or x axis, only rotate

- Tongue & frog control (DONE)
    - player 1 (top)
        - left & right arrows for rotation 
        - lower arrow to shoot tongue
    - player 2 (bottom)
        - A & D keys for rotation
        - W key to shoot tongue

- pick up power tokens (DONE)
    - drop down from top/bottom & sides, linear movement, 360 degrees, random spawn along border
    - diffent color as fly, yellow?
    - water? sun? 
    - up to 20 tokens can be stored
    - power counter displayed on frog's back?
    - token dissapears when reaches opposite edge OR when eaten by player 1 or 2.
    - players begin with 2 power each
    POTENTIAL PROBLEM!!! Randomly generates near the same frog more than once at the beginning of the game when they are unable to reach very far = unfair advantage to player

- power tongue (DONE)
    - number of power tokens (see below) caught dictates how far the tongue can go
    - fly can only come as close to the frog as the length given by 1 power token (minimum of 1 token needed to catch fly)
    - Once fly is caught, number of power tokens corresponding to the distance from the frog to the fly is used and reduces from the counter.

- Grow frog (DONE)
    - flies eaten grows the frog (purpose explained later)
    - 1 fly = growth of 1?
    - remember to constrain (NO CONSTRAINING NEEDED)

- Fly mechanics (DONE)
    - Random fly movement in y and x?
     - time based spawn
        - fly generates every 3 seconds?
    - don't dissapear until eaten by player 1/2, keeps flying around, CAN have multiple flies at once
    - limit of 3 ??? CHANGED TO NO LIMIT
    - noise()

- Requirements to eat opponent (DONE)
    - must have adequate power tokens and size 
        - (see trigger win state)
    - size requirement - triple the size of opponent (any size)
    - power requirement - must be able to reach frog = maximum storage

- title screen & ending screen (DONE)
    - title screen (state)
        - title declaration text or animation
        - Space bar to start game 
            - if key pressed, trigger game state
        EXTRA IDEA???? Option to select 1 or 2 player? (Need to build game twice, triangular format?)
        placeholder to eat instead of opponent
    - Win screen (state)
        - winner declaration text or animation
            - if tongue touches opponent & player 1 size >= player 2 size + 3, trigger win state
            OR
            - if tongue touches opponent & player 2 size >= player 1 size + 3, trigger win state
        - space bar to reset game 
            - if key pressed, trigger game state
    
    fullscreen:
    windowWidth
    windowHeight
    


