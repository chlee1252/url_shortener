const app = new Vue({
  el: "#app",
  data: {
    url: '',
    alias: '',
    created: null,
  },
  methods: {
    async createURL() {
      const response = await fetch('/url', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          url: this.url,
          alias: this.alias,
        })
      });

      this.created = await response.json();
    }
  }
});