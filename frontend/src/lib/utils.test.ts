import { cn } from "./utils";

describe("utils.cn", () => {
  it("menggabungkan classnames dan menghapus duplikat", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
    expect(cn('foo','foo','bar')).toBe('foo foo bar');
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });
});