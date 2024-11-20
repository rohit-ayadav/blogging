
const CustomToolbar = () => (
    <div id="toolbar">
        <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
            <option value="">Normal</option>
        </select>
        <select className="ql-font" defaultValue="sans-serif">
            <option value="sans-serif">Sans Serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>

        </select>
        <select className="ql-size" defaultValue="medium">
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="huge">Huge</option>

        </select>
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
        <select className="ql-color" />
        <select className="ql-background" />
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
        <button className="ql-formula" />
        <button className="ql-code-block" />
        <button className="ql-blockquote" />
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
        <select className="ql-align" />
        <button className="ql-script" value="sub" />
        <button className="ql-script" value="super" />
        <button className="ql-clean" />
    </div>
);

export default CustomToolbar;
