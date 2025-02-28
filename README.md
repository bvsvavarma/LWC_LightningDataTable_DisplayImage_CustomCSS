# Lightning-Data-Table
1. Lightning-datatable displays tabular data where each column renders the content based on the data type.
2. lightning-datatable is not supported on mobile devices.
3. Supported features include:
   a. Displaying and formatting of columns with appropriate data types.
   b. Infinite scrolling of rows.
   c. Inline editing for some data types.
   d. Header actions.
   e. Row-level actions.
   f. Resizing of columns.
   g. Selecting of rows.
   h. Sorting of columns by ascending and descending order.
   i. Text wrapping and clipping.
   j. Row numbering column.
   k. Cell content alignment.

# Define Your Custom Type

![image](https://github.com/user-attachments/assets/68041bc7-2790-44ac-9f40-5d681bef332b)

![image](https://github.com/user-attachments/assets/0e4fbe0f-fa19-48ed-b30a-0648b7d3bb2d)

# Apply Styles on a Column

![image](https://github.com/user-attachments/assets/400fbe9f-86b9-4b52-9cbd-ba3143a2f6b6)

# Update Data Table Rows - Standard Type

![image](https://github.com/user-attachments/assets/682b5112-dcde-4b54-9900-16403090c8c9)


# Update Data Table Rows - Custom Type
1. To make your custom data type editable in lightning-datatable, create an additional template to implement the UI for inline editing of the data type.
2. These high-level steps add inline edit capability.
   
   i. Create an edit template.
   
   ii. Add the edit template to the custom type definition.
   
   iii. Make the custom type editable in the column definition.


# Create an edit template

![image](https://github.com/user-attachments/assets/85468e83-298b-4e7b-80e6-607e8b892180)

# Add the edit template to the custom type definition

![image](https://github.com/user-attachments/assets/c784d30e-f303-4346-a19e-f3a55753b065)

# Make the Custom Type Editable

![image](https://github.com/user-attachments/assets/c2185ca5-c174-4f54-a33d-e4f98c806a79)

# Row-Level Actions
1. Row-level actions refer to tasks you can perform on a row of data, such as updating or deleting the row.
2. Static actions apply to all rows on the table.
3. You can perform actions on each row and handle them using the onrowaction event handler.

![image](https://github.com/user-attachments/assets/e47c17bc-d126-4c62-a7f7-061b189b2f47)


