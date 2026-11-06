// Branche std::cin sur le terminal du site : quand le programme lit une ligne, l'exécution se met en pause (Asyncify)
// jusqu'à ce que le visiteur appuie sur Entrée. Le code de MediPass n'est pas modifié.
#include <emscripten.h>
#include <iostream>
#include <streambuf>
#include <string>

EM_ASYNC_JS(char*, web_read_line, (), {
  const line = await Module.readLine();
  const size = lengthBytesUTF8(line) + 1;
  const pointer = _malloc(size);
  stringToUTF8(line, pointer, size);
  return pointer;
});

class WebLineBuffer : public std::streambuf {
  std::string line_;

 protected:
  int_type underflow() override {
    if (gptr() < egptr()) return traits_type::to_int_type(*gptr());
    std::cout.flush();
    char* raw = web_read_line();
    line_ = std::string(raw) + "\n";
    free(raw);
    setg(line_.data(), line_.data(), line_.data() + line_.size());
    return traits_type::to_int_type(*gptr());
  }
};

static WebLineBuffer web_line_buffer;

// Constructeur global : s'exécute avant main().
static struct InstallWebStdin {
  InstallWebStdin() { std::cin.rdbuf(&web_line_buffer); }
} install_web_stdin;
