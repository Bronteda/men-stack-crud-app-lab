Learnt :

The $addToSet Operator
Purpose: Adds an item to an array only if it’s not already there.

Why use it? It prevents duplicate animalIds in the user's animals array.

Example:
{ $addToSet: { animals: animalId } }
This says: "Add animalId to the animals array if it’s not already in there."

🌀 Alternative: $push
$push always adds the item, even if it’s already in the array.

Use $push if duplicates are okay:
{ $push: { animals: animalId } }
