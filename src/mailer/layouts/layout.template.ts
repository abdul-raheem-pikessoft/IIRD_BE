export function Layout(body: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Title</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }

      header {
        background-color: #2c3e50;
        color: #ecf0f1;
        padding: 20px;
        text-align: center;
      }

      header img {
        width: 150px;
      }

      footer {
        height: 50px;
        background-color: #2c3e50;
        color: #ecf0f1;
        text-align: center;
        padding: 10px 0;
        position: fixed;
        bottom: 0;
        width: 100%;
      }

      footer p {
        color: #e74c3c;
      }
    </style>
  </head>

  <body>
    <header>
      <img src="https://cdn.icon-icons.com/icons2/2699/PNG/512/nestjs_logo_icon_169927.png" alt="NestJS">
    </header>
  ${body}
    <footer>
      <div>
        <p>&copy; NestJS 2023</p>
      </div>
    </footer>
  </body>
  </html>`;
}
