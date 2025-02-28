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

# Create Row-Level Actions

![image](https://github.com/user-attachments/assets/e05b4ee6-1d00-432a-a555-289aae8b4ffd)

# Header Actions
1. Header actions refer to tasks you can perform on a column of data, such as displaying only rows that meet a criteria provided by the olumn.
2. You can perform actions on a column and handle them using the onheaderaction event handler.
3. Header actions are available in the dropdown menu in the column header.

![image](https://github.com/user-attachments/assets/4f5355b0-d7e3-4307-b690-f74e118b33f4)

# Hide Default Header Actions
1. The default header actions available on each column are Wrap Text and Clip Text.
2. To hide the drop down menu with the default header action on a column, pass in the hideDefaultActions property.
3. If hideDefaultActions is set to tru on a column that has custom header actions, the "Clip text" and "Wrap text" actions are removed from the action dropdown menu, and the content is clipped by default.

![image](https://github.com/user-attachments/assets/cc305fa8-35fd-45c8-84e1-18d1b094a97c)

# Define Header Actions
1. Bind the header actions to the actions column attribute, which can be done during initialization.

![image](https://github.com/user-attachments/assets/21d59ecc-6472-4b6a-93d7-1a92cfc3cf09)

# Wrapper Class
1. Wrapper class is a class within a class that stores a group of similar or different data type variables into a single object.
2. The use of Wrapper class helps the developer in organizing the concerned data efficiently, provide the data is properly nested.

![image](https://github.com/user-attachments/assets/a8974234-6cbd-4a8f-8f0c-2c7b85a80eb2)

# Row Selection
Selecting the checkbox selects the entire row of data and triggers the onrowselection event handler.

![image](https://github.com/user-attachments/assets/4aa85087-3b3a-4894-bd78-88611062aab8)

# Use Case for Wrapper Class
Add 2 additional columns in Data Table.
1. Count of cases for the contact.
2. Is Contact a Bad Contact (If Lead Source is Phone Inquiry and Phone Number is not present)

Also enable the users to delete multiple contacts only if for all sected records, Cases count is 0, Otherwise raise a error message.
Delete Button should be enabled only when at least 1 record is selected.

# Lazy Loading and Infinite Scrolling
1. Lazy loading helps you to load the data only when it is required. Lazy loading is an optimization technique to load the content on-demand.
2. Infinite scrolling (enable-infinite-loading) enables you to load a subset of data and then load more data when users scroll to the end of the table.

![image](https://github.com/user-attachments/assets/ed1fe262-eefd-4a20-be03-a615e16766a1)

# Infinite Loading Approaches
1. Using OFFSET: Typically this is the best approach for infinite loading if we know well in advance that the records being rendered by lightning-datatable are well under 2000 since we have certain limitations in using OFFSET in SOQL.
2. Using ID Field: ID fields are indexed fields and are auto-generated in some random fashion. But they have a unique property, each time an ID is generated, the ASCII value is greater than all previously generated ID. We can simply use the last record ID in the table and retrieve the next lot of fresh records.
