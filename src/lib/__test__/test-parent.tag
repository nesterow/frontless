<test-parent>
    <div each={ items }>
        <test-child timeout={ timeout } />
    </div>
    <test-child2 />
    <script>
        import './test-child.tag';
        import './test-child2.tag';
        this.items = [];
        // at least 100 children tags with different async operations
        for (let i = 0; i <= 100; ++i)
            this.items.push({timeout: i * 10 + 2490});
    </script>
</test-parent>