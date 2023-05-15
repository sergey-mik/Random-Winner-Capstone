export const ProductSearch = ({ setterFunction }) => {
  return (
    <div className="tc mb2">
      <input
        className="pa2 tc"
        onChange={(changeEvent) => {
          setterFunction(changeEvent.target.value)
        }}
        type="text"
        placeholder="search games here"
      />
    </div>
  )
}
