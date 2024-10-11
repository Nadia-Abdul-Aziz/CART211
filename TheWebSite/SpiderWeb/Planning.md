# Homepage Visual Planning

- Goal: Spider spins a web moving outwards from the center

- Elements & mechanics:
    - Non-moving
        - Anchor points
            - 5 Radially symmetrical lines
            - Shared origin point
            - Length and thickness TBD
            - Grow as time passes???
            - Pseudocode example for line moving towards top right:
                - line (width/2, height/2, anchor#.x2, anchor#.y2) {DEFINE VARIABLES}
                - anchor#.x2 += 1 (one pixel per frame growth)
                - anchor#.y2 += - 1 


