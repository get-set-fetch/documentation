Jekyll::Hooks.register :pages, :post_render do |page|
    require 'nokogiri'

    # debug
    puts "Firing :pages, :post_render from : " + File.basename(__FILE__) + " for : " + page.relative_path

    doc = Nokogiri::HTML(page.output)
    nodes = doc.search("pre.highlight")

    nodes.each do |node|
        node.add_next_sibling <<-copied_html
            <div class="copied is-hidden">
                <span class="is-size-6">Copied!</span>
                <span class="icon copied-ico"></span>
            </div>
        copied_html

        node.add_next_sibling <<-copy_html
            <span class="button copy icon copy-ico" onclick="javascript:copyToClipboard(this)"></span>
        copy_html

       
    end
    page.output = page.output = doc.to_html
end
  