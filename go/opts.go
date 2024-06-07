package opts

type RuleSet struct{}

func NewRuleSet() *RuleSet {
	panic("not implemented")
}

func (r *RuleSet) AddDep(a, b string) {
	panic("not implemented")
}

func (r *RuleSet) AddConflict(a, b string) {
	panic("not implemented")
}

func (r *RuleSet) IsCoherent() bool {
	panic("not implemented")
}

type Options struct{}

func New(rs *RuleSet) *Options {
	panic("not implemented")
}

func (o *Options) Toggle(opt string) {
	panic("not implemented")
}

func (o *Options) StringSlice() []string {
	panic("not implemented")
}
