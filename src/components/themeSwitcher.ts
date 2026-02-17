import { ref, onMounted } from "vue"

const theme = ref("light")

export function useTheme() {

  const applyTheme = (mode:string) => {
    theme.value = mode

    const html = document.documentElement

    // PrimeVue dark mode
    html.classList.toggle("my-app-dark", mode === "dark")

    // Tailwind dark mode
    html.classList.toggle("dark", mode === "dark")

    localStorage.setItem("theme", mode)
  }

  const toggleTheme = () => {
    applyTheme(theme.value === "dark" ? "light" : "dark")
  }

  onMounted(() => {
    const saved = localStorage.getItem("theme")

    if (saved) {
      applyTheme(saved)
    } else {
      const prefersDark =
        window.matchMedia("(prefers-color-scheme: dark)").matches

      applyTheme(prefersDark ? "dark" : "light")
    }
  })

  return { theme, toggleTheme }
}