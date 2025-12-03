# PokéTable — React + TanStack Table + PokéAPI

A Pokémon browser built with React, TanStack Table, TailwindCSS, and the PokéAPI.  
The application displays 151 Pokémon in a paginated table with filtering, search, and detailed Pokémon pages.

---

## Features

### 1. Data Table (TanStack Table)
- Built using the @tanstack/react-table library.
- Displays: ID, Name, Type(s), and Sprite.
- Responsive layout styled with TailwindCSS.

### 2. Pagination
- Client-side pagination using TanStack Table's pagination model.
- Custom UI for navigating pages.

### 3. Filtering and Search
- Search Pokémon by name.
- Filter Pokémon by type.
- Both features update the table instantly.

### 4. Detail View
- Clicking a Pokémon opens a dedicated detail page.
- The detail view includes:
  - Large official artwork
  - Types
  - English flavor text description
  - Height and weight
  - Base experience
  - Capture rate
  - Abilities (with hidden ability indicator)
  - Full stat list and total stats

### 5. API Integration
Uses the PokéAPI:
- `/pokemon?limit=151` for the list
- `/pokemon/:id` for stats and sprites
- `/pokemon-species/:id` for flavor text and capture rate

### 6. Error Handling
- Error states for both list and detail pages.
- Displays error messages and a retry button.

### 7. Routing
Implemented with React Router.

Routes:
/ - Pokémon table
/:id - Pokémon detail view


---

## Tech Stack

| Technology        | Purpose                       |
|-------------------|-------------------------------|
| React 18          | UI and state management       |
| React Router      | Routing and parameters        |
| TanStack Table v8 | Table and pagination logic    |
| Tailwind CSS      | Styling                       |
| Axios             | API requests                  |
| PokéAPI           | Data source                   |

---

## Installation

Clone the repository:
>git clone https://github.com/SilverBerserk/poke-table.git

> cd poke-table

Install dependencies:

> npm install

Start the development server:

> npm start

The application runs at:

http://localhost:3000


---

## Assumptions

- Only the first 151 Pokémon are required.
- Client-side pagination is sufficient for this dataset.
- Filtering and search occur in-memory.
- API errors are handled gracefully.

---

## Requirements Coverage

| Requirement                                | Status |
|--------------------------------------------|--------|
| Use a table library                        | Yes (TanStack Table) |
| Fetch data from PokéAPI                    | Yes |
| Show ID, Name, Types, Sprite               | Yes |
| Pagination                                 | Yes |
| Filter by type                             | Yes |
| Search by name                             | Yes |
| Detail view                                | Yes |
| Show abilities, stats, artwork             | Yes |
| Error handling                             | Yes |
| Route parameters                           | Yes |
| Async operations                           | Yes (Axios) |

---

## Contributing

Pull requests are welcome.  
Issues may be opened for suggestions or bug reports.

---

## License

This project is available under the MIT License.

