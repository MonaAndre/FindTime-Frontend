export const getBgColors = (color: string) => {
  const colorMap: Record<string, string> = {
    zinc: 'bg-zinc-200 dark:bg-zinc-700',
    red: 'bg-red-200 dark:bg-red-700',
    blue: 'bg-blue-200 dark:bg-blue-700',
    green: 'bg-green-200 dark:bg-green-700',
    orange: 'bg-orange-200 dark:bg-orange-700',
    teal: 'bg-teal-200 dark:bg-teal-700',
    sky: 'bg-sky-200 dark:bg-sky-700',
    purple: 'bg-purple-200 dark:bg-purple-700',
    lime: 'bg-lime-200 dark:bg-lime-700',
  }
  return colorMap[color] || 'bg-zinc-200 dark:bg-zinc-700'
}

export const getCategoryLabel = (color?: string) => {
  const colorMap: Record<string, string> = {
    zinc: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-600 dark:text-zinc-200 border border-zinc-700 rounded-xl p-2 inline',
    red: 'bg-red-200 text-red-700 dark:bg-red-600 dark:text-red-200  border border-red-700 rounded-xl p-2 inline',
    blue: 'bg-blue-200 text-blue-700 dark:bg-blue-600 dark:text-blue-200  border border-blue-700 rounded-xl p-2 inline',
    green:
      'bg-green-200 text-green-700 dark:bg-green-600 dark:text-green-200  border border-green-700 rounded-xl p-2 inline',
    orange:
      'bg-orange-200 text-orange-700 dark:bg-orange-600 dark:text-orange-200 border border-orange-700 rounded-xl p-2 inline',
    teal: 'bg-teal-200 text-teal-700 dark:bg-teal-600 dark:text-teal-200 border border-teal-700 rounded-xl p-2 inline',
    sky: 'bg-sky-200 text-sky-700 dark:bg-sky-600 dark:text-sky-200 border border-sky-700 rounded-xl p-2 inline',
    purple:
      'bg-purple-200 text-purple-700 dark:bg-purple-600 dark:text-purple-200 border border-purple-700 rounded-xl p-2 inline',
    lime: 'bg-lime-200 text-lime-700 dark:bg-lime-600 dark:text-lime-200 border border-lime-700 rounded-xl p-2 inline',
  }
  return colorMap[color || 'zinc'] || 'bg-zinc-200 dark:bg-zinc-700'
}

export const getEventCategory = (color?: string) => {
  const colorMap: Record<string, string> = {
    zinc: 'bg-zinc-100 text-zinc-700 border-l-zinc-500 dark:bg-zinc-800 dark:text-zinc-200',
    red: 'bg-red-50 text-red-700 border-l-red-500 dark:bg-red-900/30 dark:text-red-200',
    blue: 'bg-blue-50 text-blue-700 border-l-blue-500 dark:bg-blue-900/30 dark:text-blue-200',
    green: 'bg-green-50 text-green-700 border-l-green-500 dark:bg-green-900/30 dark:text-green-200',
    orange:
      'bg-orange-50 text-orange-700 border-l-orange-500 dark:bg-orange-900/30 dark:text-orange-200',
    teal: 'bg-teal-50 text-teal-700 border-l-teal-500 dark:bg-teal-900/30 dark:text-teal-200',
    sky: 'bg-sky-50 text-sky-700 border-l-sky-500 dark:bg-sky-900/30 dark:text-sky-200',
    purple:
      'bg-purple-50 text-purple-700 border-l-purple-500 dark:bg-purple-900/30 dark:text-purple-200',
    lime: 'bg-lime-50 text-lime-700 border-l-lime-500 dark:bg-lime-900/30 dark:text-lime-200',
  }
  return colorMap[color || 'zinc'] || colorMap.zinc
}
