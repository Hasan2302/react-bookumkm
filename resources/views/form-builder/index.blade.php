<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Builder</title>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
    <style>
        .form-builder-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .form-element {
            padding: 10px;
            border: 1px solid #ccc;
            background: #f9f9f9;
            cursor: grab;
        }
    </style>
</head>
<body>
    <h1>Form Builder</h1>
    <div id="form-builder" class="form-builder-container">
        <div class="form-element" draggable="true">Text Input</div>
        <div class="form-element" draggable="true">Checkbox</div>
        <div class="form-element" draggable="true">Radio Button</div>
    </div>

    <button id="save-form">Save Form</button>

    <script>
        const formBuilder = document.getElementById('form-builder');
        new Sortable(formBuilder, {
            animation: 150,
            ghostClass: 'sortable-ghost'
        });

        document.getElementById('save-form').addEventListener('click', () => {
            const elements = Array.from(formBuilder.children).map(el => el.textContent);
            fetch('/form-builder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                body: JSON.stringify({ elements })
            })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
        });
    </script>
</body>
</html>
