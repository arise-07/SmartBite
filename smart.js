import { useState, useEffect } from "react";

function App() {
    const [name, setName] = useState("");
    const [expiry, setExpiry] = useState("");
    const [items, setItems] = useState([]);
    const [now, setNow] = useState(new Date());
    const [expiredItem, setExpiredItem] = useState(null);

    // Load from LocalStorage
    useEffect(() => {
        const savedItems = localStorage.getItem("expiryItems");
        if (savedItems) {
            const parsed = JSON.parse(savedItems).map(item => ({
                ...item,
                expiry: new Date(item.expiry)
            }));
            setItems(parsed);
        }
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        localStorage.setItem("expiryItems", JSON.stringify(items));
    }, [items]);

    // Live clock
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Notification permission
    useEffect(() => {
        if ("Notification" in window) {
            if (Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        }
    }, []);

    const addItem = () => {
        if (!name || !expiry) {
            alert("Enter all details");
            return;
        }

        const newItem = {
            id: Date.now(),
            name,
            expiry: new Date(expiry),
            notified: false,
            expiredShown: false
        };

        setItems([...items, newItem]);
        setName("");
        setExpiry("");
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    // Expiry Logic
    useEffect(() => {
        setItems(prevItems =>
            prevItems.map(item => {
                const diff = item.expiry - now;

                // Expiring Soon (2h)
                if (
                    diff > 0 &&
                    diff <= 2 * 60 * 60 * 1000 &&
                    !item.notified &&
                    "Notification" in window &&
                    Notification.permission === "granted"
                ) {
                    new Notification("⚠️ Expiry Alert", {
                        body: `${item.name} is expiring soon!`
                    });
                    return { ...item, notified: true };
                }

                // Fully expired
                if (diff <= 0 && !item.expiredShown) {
                    setExpiredItem(item);

                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("❌ Item Expired!", {
                            body: `${item.name} has expired!`
                        });
                    }

                    return { ...item, expiredShown: true };
                }

                return item;
            })
        );
    }, [now]);

    const formatTimeLeft = (expiryDate) => {
        const diff = expiryDate - now;

        if (diff <= 0) return "❌ Expired";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        if (diff <= 2 * 60 * 60 * 1000)
            return `⚠️ Expiring Soon (${hours}h ${minutes}m left)`;

        return `${hours}h ${minutes}m left`;
    };

    // Sorting
    const activeItems = items
        .filter(item => item.expiry > now)
        .sort((a, b) => a.expiry - b.expiry);

    const expiredItems = items.filter(item => item.expiry <= now);

    // 🟡 Use Soon Items (24 hours)
    const useSoonItems = items.filter(item => {
        const diff = item.expiry - now;
        return diff > 0 && diff <= 24 * 60 * 60 * 1000;
    });

    // 🔵 Regular Recipe (OLD - UNCHANGED)
    const getRecipeSuggestion = () => {
        const names = items.map(i => i.name.toLowerCase());

        const recipes = [
            { name: "Masala Omelette 🥚", ingredients: ["eggs", "onion", "chilli"], steps: "Beat eggs → Add onion & chilli → Fry" },
            { name: "Paneer Butter Masala 🧀", ingredients: ["paneer", "butter", "tomato"], steps: "Cook tomato gravy → Add butter → Add paneer" },
            { name: "Vegetable Pulao 🍚", ingredients: ["rice", "carrot", "peas"], steps: "Cook rice → Add veggies → Mix spices" },
            { name: "French Toast 🍞", ingredients: ["bread", "milk", "eggs"], steps: "Mix egg & milk → Dip bread → Fry" },
            { name: "Egg Curry 🍳", ingredients: ["eggs", "onion", "tomato"], steps: "Boil eggs → Prepare gravy → Add eggs" },
            { name: "Egg Rice 🍳", ingredients: ["eggs", "rice"], steps: "Boil Rice → Stir with Rice → Serve" },
            {
                name: "Paneer Butter Masala",
                ingredients: ["paneer", "butter", "tomato", "cream", "onion"],
                steps: "Cook onion-tomato gravy. Add butter and cream. Add paneer and simmer."
            },
            {
                name: "Masala Dosa",
                ingredients: ["dosa batter", "potato", "onion", "mustard seeds"],
                steps: "Prepare potato masala. Spread dosa batter on tawa. Add filling and fold."
            },
            {
                name: "Idli",
                ingredients: ["idli batter"],
                steps: "Pour batter into moulds. Steam for 10-12 minutes."
            },
            {
                name: "Tomato Rice",
                ingredients: ["rice", "tomato", "onion", "green chilli"],
                steps: "Cook rice. Prepare tomato masala. Mix and cook for 5 minutes."
            },
            {
                name: "Jeera Rice",
                ingredients: ["rice", "cumin seeds", "ghee"],
                steps: "Heat ghee. Add cumin seeds. Mix with cooked rice."
            },
            {
                name: "Bhindi Fry",
                ingredients: ["bhindi", "onion", "chilli powder", "turmeric"],
                steps: "Cut bhindi. Add spices and fry until crisp."
            },
            {
                name: "Baingan Bharta",
                ingredients: ["brinjal", "onion", "tomato", "garlic"],
                steps: "Roast brinjal. Mash and cook with onion-tomato masala."
            },
            {
                name: "Dal Tadka",
                ingredients: ["toor dal", "garlic", "cumin seeds", "chilli"],
                steps: "Cook dal. Add tempering of garlic, cumin and chilli."
            },
            {
                name: "Palak Paneer",
                ingredients: ["spinach", "paneer", "garlic", "onion"],
                steps: "Boil spinach and grind. Cook with onion and paneer."
            },
            {
                name: "Matar Paneer",
                ingredients: ["paneer", "peas", "onion", "tomato"],
                steps: "Prepare gravy. Add peas and paneer. Cook well."
            },
            {
                name: "Chicken Curry",
                ingredients: ["chicken", "onion", "tomato", "garam masala"],
                steps: "Cook onion-tomato masala. Add chicken and cook until done."
            },
            {
                name: "Chicken Biryani",
                ingredients: ["rice", "chicken", "curd", "biryani masala"],
                steps: "Cook chicken masala. Layer with rice. Dum cook."
            },
            {
                name: "Vegetable Biryani",
                ingredients: ["rice", "carrot", "beans", "peas", "biryani masala"],
                steps: "Cook vegetables. Layer with rice and cook on dum."
            },
            {
                name: "Kadhi Pakora",
                ingredients: ["curd", "besan", "onion", "turmeric"],
                steps: "Prepare kadhi base. Add pakoras and simmer."
            },
            {
                name: "Pav Bhaji",
                ingredients: ["potato", "peas", "tomato", "pav bhaji masala"],
                steps: "Mash vegetables. Cook with masala. Serve with pav."
            },
            {
                name: "Poha",
                ingredients: ["poha", "onion", "mustard seeds", "lemon"],
                steps: "Soak poha. Saute onion and spices. Mix and cook."
            },
            {
                name: "Medu Vada",
                ingredients: ["urad dal", "green chilli", "curry leaves"],
                steps: "Grind dal. Shape and deep fry."
            },
            {
                name: "Paneer Tikka",
                ingredients: ["paneer", "yogurt", "chilli powder", "capsicum"],
                steps: "Marinate paneer. Grill until golden."
            },
            {
                name: "Veg Manchurian",
                ingredients: ["cabbage", "carrot", "maida", "soy sauce"],
                steps: "Make balls. Fry and toss in sauce."
            },
            {
                name: "Gobi Manchurian",
                ingredients: ["cauliflower", "maida", "soy sauce"],
                steps: "Fry gobi florets. Toss in Manchurian sauce."
            },
            {
                name: "Fish Fry",
                ingredients: ["fish", "chilli powder", "turmeric", "lemon"],
                steps: "Marinate fish. Shallow fry until crisp."
            },
            {
                name: "Rasam",
                ingredients: ["tomato", "tamarind", "rasam powder"],
                steps: "Boil ingredients. Add tempering."
            },
            {
                name: "Vegetable Kurma",
                ingredients: ["carrot", "beans", "coconut", "onion"],
                steps: "Cook vegetables. Add coconut paste and simmer."
            },
            {
                name: "Chapati",
                ingredients: ["wheat flour", "water"],
                steps: "Prepare dough. Roll and cook on tawa."
            },
            {
                name: "Poori",
                ingredients: ["wheat flour", "oil"],
                steps: "Prepare dough. Roll and deep fry."
            },
            {
                name: "Upma",
                ingredients: ["rava", "onion"],
                steps: "Roast rava. Add tempered vegetables and cook."
            },
            {
                name: "Paneer Bhurji",
                ingredients: ["paneer", "onion", "tomato", "chilli"],
                steps: "Crumble paneer. Cook with masala."
            },
            {
                name: "Egg Bhurji",
                ingredients: ["egg", "onion", "tomato", "chilli"],
                steps: "Scramble eggs with onion and spices."
            },
            {
                name: "Aloo Gobi",
                ingredients: ["potato", "cauliflower", "turmeric"],
                steps: "Cook potato and gobi with spices."
            },
            {
                name: "Mushroom Masala",
                ingredients: ["mushroom", "onion", "tomato"],
                steps: "Cook mushroom in spicy gravy."
            },
            {
                name: "Kheer",
                ingredients: ["rice", "milk", "sugar"],
                steps: "Boil milk. Add rice and sugar. Cook till thick."
            },
            {
                name: "Gulab Jamun",
                ingredients: ["milk powder", "sugar", "ghee"],
                steps: "Prepare dough. Fry balls and soak in syrup."
            },
            {
                name: "Halwa",
                ingredients: ["rava", "sugar", "ghee"],
                steps: "Roast rava. Add sugar syrup and cook."
            },
            {
                name: "Thepla",
                ingredients: ["wheat flour", "methi", "turmeric"],
                steps: "Prepare dough with methi. Roll and cook."
            },
            {
                name: "Dhokla",
                ingredients: ["besan", "curd", "eno"],
                steps: "Prepare batter. Steam and temper."
            },
            {
                name: "Pani Puri",
                ingredients: ["puri", "potato", "tamarind chutney"],
                steps: "Fill puri with mixture. Add chutney and serve."
            },
            {
                name: "Sev Puri",
                ingredients: ["puri", "potato", "sev", "chutney"],
                steps: "Assemble ingredients on puri."
            },
            {
                name: "Maggie Masala",
                ingredients: ["noodles", "onion", "capsicum"],
                steps: "Boil noodles. Add vegetables and masala."
            },
            {
                name: "Corn Chaat",
                ingredients: ["corn", "onion", "lemon", "chilli powder"],
                steps: "Mix boiled corn with spices."
            },
            {
                name: "Besan Chilla",
                ingredients: ["besan", "onion", "green chilli"],
                steps: "Prepare batter. Cook like pancake."
            },
            {
                name: "Veg Sandwich",
                ingredients: ["bread", "butter", "cucumber", "tomato"],
                steps: "Spread butter. Add vegetables and grill."
            },
            {
                name: "Paneer Sandwich",
                ingredients: ["bread", "paneer", "butter"],
                steps: "Add paneer filling and grill."
            },
            {
                name: "Lassi",
                ingredients: ["curd", "sugar"],
                steps: "Blend curd and sugar."
            },
            {
                name: "Buttermilk",
                ingredients: ["curd", "water", "salt"],
                steps: "Blend curd with water and salt."
            },
            {
                name: "Veg Fried Rice",
                ingredients: ["rice", "carrot", "beans", "soy sauce"],
                steps: "Saute vegetables. Add rice and soy sauce."
            },
            {
                name: "Paneer Fried Rice",
                ingredients: ["rice", "paneer", "soy sauce"],
                steps: "Cook paneer. Mix with rice and sauce."
            },
            {
                name: "Chicken Fried Rice",
                ingredients: ["rice", "chicken", "soy sauce"],
                steps: "Cook chicken. Add rice and sauce."
            },
            {
                name: "Samosa",
                ingredients: ["maida", "potato", "peas"],
                steps: "Prepare filling. Stuff and deep fry."
            },

            {
                name:"Apple Juice",
                ingredients:["apple","milk"],
                steps: "Cut Apples,Add Milk and Juice Up"

            }




        ];

        for (let recipe of recipes) {
            const matchCount = recipe.ingredients.filter(ing =>
                names.includes(ing)
            ).length;

            if (matchCount >= 2) {
                return `Recipe: ${recipe.name}\n\nSteps:\n${recipe.steps}`;
            }
        }

        return "No matching Indian recipe found.";
    };

    // 🟡 NEW Use Soon Recipe (Separate System)
    const getUseSoonRecipe = () => {
        if (useSoonItems.length === 0) {
            return "No urgent ingredients to suggest recipe.";
        }

        const names = useSoonItems.map(i => i.name.toLowerCase());

        const recipes = [
            { name: "Curd Rice 🍚", ingredients: ["rice", "curd"], steps: "Mix rice with curd → Add seasoning" },
            { name: "Masala Omelette 🥚", ingredients: ["eggs", "onion", "chilli"], steps: "Beat eggs → Add onion → Fry" },
            { name: "Paneer Quick Fry 🧀", ingredients: ["paneer", "butter"], steps: "Heat butter → Add paneer → Fry lightly" },
            { name: "French Toast 🍞", ingredients: ["bread", "milk", "eggs"], steps: "Dip bread → Fry until golden" }
        ];

        for (let recipe of recipes) {
            const matchCount = recipe.ingredients.filter(ing =>
                names.includes(ing)
            ).length;

            if (matchCount >= 2) {
                return `Use Soon Recipe: ${recipe.name}\n\nSteps:\n${recipe.steps}`;
            }
        }

        return "Use soon items available, but no matching recipe found.";
    };

    const getShoppingList = () => {
        const essentials = ["Milk", "Eggs", "Rice", "Onion", "Bread", "Paneer", " Cheese", " Cream", " Nutella", " Apple", " Orange"

            , " Fish", " Prawns"," Mutton", " Chicken", " Ketchup", " Mayonnaise",
            "Milk", "Cabbage", "Beans", "Cauliflower", "Carrot",
            "Chilli", "Ginger", "Tomato", " Capsicum", ];
        const names = items.map(i => i.name.toLowerCase());
        const missing = essentials.filter(e => !names.includes(e));

        return missing.length > 0
            ? "Buy: " + missing.join(", ")
            : "You have essentials!";
    };

    return (
        <div className="app-container">

            <h1 className="main-title">🍽 SMARTBITE</h1>

            <div className="input-section">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                />

                <input
                    type="datetime-local"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="input-field"
                />

                <button onClick={addItem} className="primary-btn">
                    Add Item
                </button>
            </div>

            <div className="section">
                <h2>🟡 Use Them Soon</h2>
                {useSoonItems.length === 0 && <p className="empty-text">No urgent items</p>}
                {useSoonItems.map(item => (
                    <div key={item.id} className="card warning">
                        <strong>{item.name}</strong>
                        <p>{formatTimeLeft(item.expiry)}</p>
                    </div>
                ))}
            </div>

            <div className="section">
                <h2>⏳ Tracked Items</h2>
                {activeItems.map(item => (
                    <div key={item.id} className="card">
                        <strong>{item.name}</strong>
                        <p>{formatTimeLeft(item.expiry)}</p>
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="danger-btn"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div className="section">
                <h2>❌ Expired Items</h2>
                {expiredItems.length === 0 && <p className="empty-text">No expired items</p>}
                {expiredItems.map(item => (
                    <div key={item.id} className="card expired">
                        <strong>{item.name}</strong>
                        <p>Expired</p>
                        <button
                            onClick={() => deleteItem(item.id)}
                            className="danger-btn"
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>

            <div className="section">
                <h2>🟡 Use Soon Recipe</h2>
                <pre className="recipe-box">{getUseSoonRecipe()}</pre>
            </div>

            <div className="section">
                <h2>🍛 Indian Recipe Suggestion</h2>
                <pre className="recipe-box">{getRecipeSuggestion()}</pre>
            </div>

            <div className="section">
                <h2>🛒 Shopping List</h2>
                <p className="shopping-box">{getShoppingList()}</p>
            </div>

            {expiredItem && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>❌ Item Expired!</h2>
                        <p>{expiredItem.name} has expired.</p>
                        <button
                            onClick={() => setExpiredItem(null)}
                            className="primary-btn"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>

    );
}
export default App;
