##### GET /price
Returns all entries in the items table (ID, item name, cost)

##### GET /price/:itemname
Returns all entries with ${itemname}

##### GET /maxprices
Returns a list of max prices of items grouped by item name

##### GET /maxprices/:itemname
Returns the max price for ${itemname}

##### POST /edit
Creates a new item given JSON inputs of "ID", "ITEM Name", and "COST"

##### PATCH /edit/:itemid
Edits entry ${itemid} given JSON inputs of "ITEM Name" and "COST"

##### DELETE /edit/:itemid
Deletes entry ${itemid}
