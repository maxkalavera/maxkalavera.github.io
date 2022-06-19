
export interface QueueType<Type> {
  data: Array<Type>
  enqueue: (item: Type) => void
  dequeue: () => Type | undefined
  peek: () => Type
  clear: () => void
}

export default function Queue<Type>(): QueueType<Type> {
  return Object.create(
    {
      data: Array<Type>(),
      enqueue: function enqueue(item: Type) {
        this.data.push(item)
      },
      dequeue: function dequeue(): Type | undefined {
        return this.data.shift()
      },
      peek: function peek() {
        return this.data.at(-1)
      },
      clear: function clear() {
        return this.data.splice(0, this.data.length)
      }
    } as QueueType<Type>
  )
}