jest.spyOn(console, 'warn').mockImplementation((message: string) => {
  if (message.includes('express-expeditious: You did not supply an "engine"')) {
    return; // Suppress this specific warning
  }
  console.warn(message); // Keep other warnings intact
});
