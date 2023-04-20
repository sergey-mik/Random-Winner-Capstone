export const ProductSearch = ({ setterFunction }) => {
  return (
    <div>
      <input
        onChange={(changeEvent) => {
          setterFunction(changeEvent.target.value)
        }}
        type="text"
        placeholder="search games here"
      />
    </div>
  )
}
