const templates = {
  classic: `
    <div class="resume classic-template">
      <h1>{{name}}</h1>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Phone:</strong> {{phone}}</p>
      <hr>
      <h2>Education</h2>
      <p>{{education}}</p>
      <h2>Skills</h2>
      <ul>{{skills}}</ul>
      <h2>Experience</h2>
      <p>{{experience}}</p>
    </div>
  `,

  modern: `
    <div class="resume modern-template">
      <div class="header">
        <h1>{{name}}</h1>
        <p>{{email}} | {{phone}}</p>
      </div>
      <div class="content">
        <section>
          <h2>Education</h2>
          <p>{{education}}</p>
        </section>
        <section>
          <h2>Skills</h2>
          <ul>{{skills}}</ul>
        </section>
        <section>
          <h2>Experience</h2>
          <p>{{experience}}</p>
        </section>
      </div>
    </div>
  `,

  minimal: `
    <div class="resume minimal-template">
      <h1>{{name}}</h1>
      <p>{{email}} | {{phone}}</p>
      <p><strong>Education:</strong> {{education}}</p>
      <p><strong>Skills:</strong> {{skills}}</p>
      <p><strong>Experience:</strong> {{experience}}</p>
    </div>
  `
};
